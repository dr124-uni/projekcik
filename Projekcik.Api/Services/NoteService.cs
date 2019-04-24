﻿using System;
using System.Linq;
using Projekcik.Api.Models;

namespace Projekcik.Api.Services
{
    public class NoteService : INoteService
    {
        private readonly DataContext _context;

        public NoteService(DataContext context)
        {
            _context = context;
        }

        public Note GetNoteById(Guid id)
        {
            return _context.Notes.Find(id);
        }

        public IQueryable<Note> GetNotesByAuthorId(Guid authorId)
        {
            return _context.Notes.Where(x => x.Author.Id == authorId);
        }

        public IQueryable<Note> GetQuery()
        {
            return _context.Notes;
        }

        public IQueryable<Note> Search(ISearchParams searchParams, IPagerParams pagerParams)
        {
            const int pageSize = 10;
            var query = _context.Notes.AsQueryable();

            if (searchParams.CourseId.HasValue)
                query = query.Where(x => x.CourseId == searchParams.CourseId);
            else if (searchParams.UniversityId.HasValue)
                query = query.Where(x => x.Course.UniversityId == searchParams.UniversityId);
            else if (searchParams.VoivodeshipId.HasValue)
                query = query.Where(x => x.Course.University.VoivodeshipId == searchParams.VoivodeshipId);

            if (!string.IsNullOrWhiteSpace(searchParams.SortBy))
            {
                switch (searchParams.SortBy)
                {
                    case "price":
                        if (searchParams.SortOrder == "Asc")
                            query = query.OrderBy(x => x.Price);
                        else
                            query = query.OrderByDescending(x => x.Price);
                        break;
                    case "name":
                        if (searchParams.SortOrder == "Asc")
                            query = query.OrderBy(x => x.Name);
                        else
                            query = query.OrderByDescending(x => x.Name);
                        break;
                    case "ordercount":
                        if (searchParams.SortOrder == "Asc")
                            query = query.OrderBy(x => x.Buyers);
                        else
                            query = query.OrderByDescending(x => x.Buyers);
                        break;
                    case "created":
                        if (searchParams.SortOrder == "Asc")
                            query = query.OrderBy(x => x.CreatedAt);
                        else
                            query = query.OrderByDescending(x => x.CreatedAt);
                        break;
                    case "updated":
                        if (searchParams.SortOrder == "Asc")
                            query = query.OrderBy(x => x.ModifiedAt);
                        else
                            query = query.OrderByDescending(x => x.ModifiedAt);
                        break;
                }

            }
            else if (string.IsNullOrWhiteSpace(searchParams.SortBy))
            {
                query = query.OrderBy(x => x.Name);
            }

            if (!string.IsNullOrWhiteSpace(searchParams.NoteName))
                query = query.Where(x => x.Name.Contains(searchParams.NoteName));

            if (searchParams.Semester.HasValue)
                query = query.Where(x => x.Semester == searchParams.Semester);

            return query.Skip(pagerParams.Page * pageSize)
                .Take(pageSize);
        }

        public Note Create(Note note)
        {
            _context.Notes.Add(note);
            _context.SaveChanges();

            return note;
        }

        public void Buy(User user, Note note)
        {
            var link = new UserNote
            {
                User = user,
                UserId = user.Id,
                Note = note,
                NoteId = note.Id
            };

            _context.Add(link);
            _context.SaveChanges();
        }
    }
}