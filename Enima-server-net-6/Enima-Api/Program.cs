using Repository.Core;
using Repository.Core.Models;
using Repository.Core.Interfaces;
using Repository.EFCore;
using Repository.EFCore.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using AutoMapper;
using Microsoft.Extensions.FileProviders;
using Enima_Api.Services;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
 
// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddDbContext<ApplicationDbContext>(op =>
        op.UseSqlServer
        (    builder.Configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName))
                     .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking),
           ServiceLifetime.Scoped
        );

// Add Cors
 

builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
        builder => builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});




builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped(typeof(IBaseRepository<Brand, Guid>), typeof(BaseRepository<Brand>));
builder.Services.AddScoped(typeof(IBaseRepository<Categorie, Guid>), typeof(BaseRepository<Categorie>));
builder.Services.AddScoped(typeof(IBaseRepository<ImageUrl, Guid>), typeof(BaseRepository<ImageUrl>));
builder.Services.AddScoped(typeof(IBaseRepository<Product, Guid>), typeof(BaseRepository<Product>));


builder.Services.AddTransient<IOnlyTestRepository, OnlyTestRepository>();


builder.Services.AddTransient<IFileUploadService, FirebaseUploadFile>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

 
var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),
                                            @IFileUploadService.StaticFolder)),
    RequestPath = new PathString("/"+IFileUploadService.StaticFolder)
});

//RequestPath = new PathString("/${IFileUploadService.StaticFolder}")


/*
app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(
                   Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles")),
    RequestPath = "/StaticFiles",
    EnableDefaultFiles = true
});
app.UseStaticFiles();
*/

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
