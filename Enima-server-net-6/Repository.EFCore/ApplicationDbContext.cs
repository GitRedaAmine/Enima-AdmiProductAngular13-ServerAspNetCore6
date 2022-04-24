using Microsoft.EntityFrameworkCore;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.EFCore
{
    public   class AppDbContext : DbContext
    {
 

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public   DbSet<Product> Products { get; set; }
        public   DbSet<Brand> Brands { get; set; }
        public   DbSet<Categorie> Categories { get; set; }
        public   DbSet<ImageUrl> ImageUrls { get; set; }
                
        public   DbSet<RefreshToken> RefreshTokens { get; set; }
        public   DbSet<User> Users { get; set; }

        #region Required
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Brand>().HasData(
                    new Brand { uuid= Guid.NewGuid(),  Name="default brand" });

            modelBuilder.Entity<Categorie>().HasData(
           new Brand { uuid = Guid.NewGuid(), Name = "default Categorie" });

        }
        #endregion

 
    }
}