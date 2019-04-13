﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Projekcik.Api.Models;

namespace Projekcik.Api.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20190413215433_remove subject")]
    partial class removesubject
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Projekcik.Api.Models.Note", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("AuthorId");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.Property<DateTime>("ModifiedAt")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(5,2)");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("Projekcik.Api.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("EmailAddress")
                        .HasMaxLength(150);

                    b.Property<long?>("FacebookId");

                    b.Property<string>("FirstName")
                        .HasMaxLength(50);

                    b.Property<string>("LastName")
                        .HasMaxLength(50);

                    b.Property<DateTime>("ModifiedAt")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Password")
                        .HasMaxLength(256);

                    b.Property<string>("PictureUrl");

                    b.Property<string>("UserName")
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.HasIndex("EmailAddress")
                        .IsUnique()
                        .HasFilter("[EmailAddress] IS NOT NULL");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Projekcik.Api.Models.UserNote", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<Guid>("NoteId");

                    b.HasKey("UserId", "NoteId");

                    b.HasIndex("NoteId");

                    b.ToTable("UserNote");
                });

            modelBuilder.Entity("Projekcik.Api.Models.Note", b =>
                {
                    b.HasOne("Projekcik.Api.Models.User", "Author")
                        .WithMany("CreatedNotes")
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Projekcik.Api.Models.UserNote", b =>
                {
                    b.HasOne("Projekcik.Api.Models.Note", "Note")
                        .WithMany("Buyers")
                        .HasForeignKey("NoteId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Projekcik.Api.Models.User", "User")
                        .WithMany("BoughtNotes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
