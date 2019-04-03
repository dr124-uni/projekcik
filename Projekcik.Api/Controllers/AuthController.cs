﻿using System;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekcik.Api.Helpers;
using Projekcik.Api.Models;
using Projekcik.Api.Models.DTO;
using Projekcik.Api.Services;

namespace Projekcik.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenIssuer _tokenIssuer;
        private readonly IHttpContextAccessor _user;

        public AuthController(IUserService userService,
            ITokenIssuer tokenIssuer,
            IHttpContextAccessor httpContextAccessor)
        {
            _userService = userService;
            _tokenIssuer = tokenIssuer;
            _user = httpContextAccessor;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthDto userDto)
        {
            var user = _userService.Authenticate(userDto.EmailAddress, userDto.Password);
            if (user == null)
                return BadRequest(new {message = "Username or password is incorrect"});
            var token = _tokenIssuer.Issue(user);
            
            return Ok(new
            {
                user.Id,
                Token = token
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {

            var user = Mapper.Map<User>(userDto);
            try
            {
                _userService.Create(user, userDto.Password);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        [HttpGet("me")]
        public IActionResult GetById()
        {
            var userId = _user.CurrentUser();
            var user = _userService.GetById(userId);
            var userDto = Mapper.Map<UserDto>(user);
            return Ok(userDto);
        }
    }
}