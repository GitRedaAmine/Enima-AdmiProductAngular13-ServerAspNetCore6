using Microsoft.EntityFrameworkCore;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.EFCore
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Categorie> Categories { get; set; }
        public DbSet<ImageUrl> ImageUrls { get; set; }
        public DbSet<OnlyTest> OnlyTests { get; set; }
    }
}