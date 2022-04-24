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
using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.Extensions.FileProviders;
using Enima_Api.Services;
using Enima_Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Enima_Api.Helpers;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
{
    var services = builder.Services;
    var env = builder.Environment;

    services.AddDbContext<AppDbContext>(op =>
            op.UseSqlServer
            (builder.Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
                         .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking),
               ServiceLifetime.Scoped
            );

    services.AddCors(
    //    options =>
    //{
    //    options.AddPolicy(MyAllowSpecificOrigins,
    //        builder => builder.AllowAnyOrigin()
    //        .AllowAnyMethod()
    //        .AllowAnyHeader());
    //}
    );

    services.AddControllers().AddJsonOptions(x =>
    {
        // serialize enums as strings in api responses (e.g. Role)
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // configure strongly typed settings object

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = TokenHelper.Issuer,
                    ValidAudience = TokenHelper.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(TokenHelper.Secret)),
                    ClockSkew = TimeSpan.Zero
                };

            });

    services.AddAuthorization();
    // configure DI for application services
    services.AddTransient<ITokenService, TokenService>();
    services.AddTransient<IUserService, UserService>();

    services.AddTransient<IUnitOfWork, UnitOfWork>();
    services.AddScoped(typeof(IBaseRepository<Brand, Guid>), typeof(BaseRepository<Brand>));
    services.AddScoped(typeof(IBaseRepository<Categorie, Guid>), typeof(BaseRepository<Categorie>));
    services.AddScoped(typeof(IBaseRepository<ImageUrl, Guid>), typeof(BaseRepository<ImageUrl>));
    services.AddScoped(typeof(IBaseRepository<Product, Guid>), typeof(BaseRepository<Product>));
    services.AddTransient<IFileUploadService, FirebaseUploadFile>();

}

var app = builder.Build();

// migrate any database changes on startup (includes initial db creation)
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dataContext.Database.Migrate();
}

// Configure the HTTP request pipeline.


{ 
    if (app.Environment.IsDevelopment())
    {
        // generated swagger json and swagger ui middleware
        app.UseSwagger();
        app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", ".NET Sign-up and Verification API"));

    }

    // global cors policy
    app.UseCors(x => x
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());

 
 
    app.UseStaticFiles();

 
    app.UseHttpsRedirection();
    app.UseCors(MyAllowSpecificOrigins);


    app.UseAuthentication();
    app.UseAuthorization();

    var directoryStatic = Path.Combine(Directory.GetCurrentDirectory(), @IFileUploadService.StaticFolder) ;
    if (!Directory.Exists(directoryStatic))
    {
        Directory.CreateDirectory(directoryStatic);
    }
    app.UseStaticFiles(new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(directoryStatic),
        RequestPath = new PathString("/" + IFileUploadService.StaticFolder)
    });
    app.MapControllers();
}


app.Run();
