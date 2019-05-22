﻿using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Projekcik.Api.Helpers;
using Projekcik.Api.Models;
using Projekcik.Api.Services;

namespace Projekcik.Api.Controllers
{
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private static readonly ILog _log =
            LogManager.GetLogger(typeof(UniController));

        private readonly INoteService _noteService;
        private readonly IPaymentService _paymentService;
        private readonly IHttpContextAccessor _user;
        private readonly IUserService _userService;

        public PaymentController(
            IConfiguration configuration,
            INoteService noteService,
            IUserService userService,
            IHttpContextAccessor user,
            IPaymentService paymentService, DataContext context)
        {
            _noteService = noteService;
            _userService = userService;
            _user = user;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("pay")]
        public IActionResult Pay([FromBody] Guid[] input)
        {
            var userId = _user.GetCurrentUserId();
            var user = _userService.GetById(userId);
            if (user == null)
                return Unauthorized();

            var notes = input?.Select(x => _noteService.GetNoteById(x)).Where(x => x != null && x.AuthorId != userId)
                            .ToArray() ?? new Note[0];
            if (!notes.Any())
                return BadRequest();

            var ipAddress = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            if (ipAddress == "0.0.0.1")
                ipAddress = "127.0.0.1";

            try
            {
                _log.Info($"Creating payment link for user: {userId}");
                var redirect = _paymentService.CreateOrder(notes, user, ipAddress);
                return Ok(new
                {
                    redirectUrl = redirect
                });
            }
            catch (Exception e)
            {
                _log.Warn(
                    $"Couldn't create payment link, reason: {e.Message}, inner: {e.InnerException?.Message ?? "none"}\n" +
                    $"userId={userId}, " +
                    $"selectedNotes={string.Join(", ", notes.Select(x => x.Id))}");

                return BadRequest(e);
            }
        }

        private Task UpdatePaymentStatusAsync(PayUPaymentService.PaymentStatus status)
        {
            return Task.Run(() =>
            {
                try
                {
                    _log.Info($"Updating transaction {status.Order.ExtOrderId}, status: {status.Order.Status}");
                    _paymentService.UpdateTransaction(status);
                }
                catch (Exception e)
                {
                    _log.Warn(
                        $"Transaction notify failed, reason: {e.Message}, inner: {e.InnerException?.Message ?? "none"}" +
                        "\n entity:\n" +
                        $"{JsonConvert.SerializeObject(status, Formatting.Indented)}");
                }
            });
        }

        [HttpPost("notify")]
        public IActionResult NotifyPaymentStatus([FromBody] PayUPaymentService.PaymentStatus status)
        {
            var sandboxNotifyAddresses = new[]
            {
                "185.68.14.10",
                "185.68.14.11",
                "185.68.14.12",
                "185.68.14.26",
                "185.68.14.27",
                "185.68.14.28"
            };

            var clientIp = HttpContext.Connection.RemoteIpAddress.MapToIPv4();
            if (!sandboxNotifyAddresses.Select(IPAddress.Parse).Contains(clientIp))
                return StatusCode(418);

            UpdatePaymentStatusAsync(status);

            return Ok();
        }

        [HttpPost("payout")]
        public IActionResult Payout([FromBody] PayUPaymentService.PayoutParameters payoutParameters)
        {
            var userId = _user.GetCurrentUserId();
            var user = _userService.GetById(userId);
            if (user == null)
                return Unauthorized();

            if (user.Balance <= 1m)
                return BadRequest();

            try
            {
                _log.Info($"Creating payout for user: {userId} for {user.Balance}zł");
                _paymentService.CreatePayout(user, payoutParameters);
                _log.Info($"Successfully payed out {user.Balance}zł for user: {userId}");
                _userService.PayoutBalance(user, user.Balance);

                return Ok();
            }
            catch (Exception e)
            {
                _log.Warn(
                    $"Couldn't create payout link, reason: {e.Message}, inner: {e.InnerException?.Message ?? "none"}\n" +
                    $"userId={userId}, " +
                    $"params: {JsonConvert.SerializeObject(payoutParameters)}");
                return BadRequest(e);
            }
        }

        [HttpGet("order-details/{transactionId}")]
        public IActionResult GetTransactionDetails(string transactionId)
        {
            Guid.TryParse(transactionId, out var transId);
            var transaction = _paymentService.GetTransactionDetails(transId);
            if (transaction == null)
                return NotFound();

            var noteIds = transaction.OrderedNotesIds;
            var notes = _noteService.GetQuery().Where(x => noteIds.Contains(x.Id));

            return Ok(new
            {
                status = transaction.Status,
                notes = notes.Select(x => new
                {
                    x.Id,
                    x.Name
                })
            });
        }
    }
}