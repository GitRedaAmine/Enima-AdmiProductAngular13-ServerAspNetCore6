﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Repository.EFCore;

#nullable disable

namespace Repository.EFCore.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Repository.Core.Models.Brand", b =>
                {
                    b.Property<Guid>("uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("uuid");

                    b.ToTable("Brands");
                });

            modelBuilder.Entity("Repository.Core.Models.Categorie", b =>
                {
                    b.Property<Guid>("uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("uuid");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Repository.Core.Models.ImageUrl", b =>
                {
                    b.Property<Guid>("uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("ProductId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("uuid");

                    b.HasIndex("ProductId");

                    b.ToTable("ImageUrls");
                });

            modelBuilder.Entity("Repository.Core.Models.OnlyTest", b =>
                {
                    b.Property<Guid>("uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("uuid");

                    b.ToTable("OnlyTests");
                });

            modelBuilder.Entity("Repository.Core.Models.Product", b =>
                {
                    b.Property<Guid>("uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BrandId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CategorieId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("Rating")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("Stocks")
                        .HasColumnType("int");

                    b.HasKey("uuid");

                    b.HasIndex("BrandId");

                    b.HasIndex("CategorieId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("Repository.Core.Models.ImageUrl", b =>
                {
                    b.HasOne("Repository.Core.Models.Product", "Product")
                        .WithMany("ImageUrls")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("Repository.Core.Models.Product", b =>
                {
                    b.HasOne("Repository.Core.Models.Brand", "Brand")
                        .WithMany("Products")
                        .HasForeignKey("BrandId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Repository.Core.Models.Categorie", "Categorie")
                        .WithMany("Products")
                        .HasForeignKey("CategorieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Brand");

                    b.Navigation("Categorie");
                });

            modelBuilder.Entity("Repository.Core.Models.Brand", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("Repository.Core.Models.Categorie", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("Repository.Core.Models.Product", b =>
                {
                    b.Navigation("ImageUrls");
                });
#pragma warning restore 612, 618
        }
    }
}