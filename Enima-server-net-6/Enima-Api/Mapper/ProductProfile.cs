using AutoMapper;
using Enima_Api.DTO;
using Repository.Core.Models;

namespace Enima_Api.Mapper
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name))
                .ForMember(dest => dest.Description, source => source.MapFrom(source => source.Description))
                .ForMember(dest => dest.Rating, source => source.MapFrom(source => source.Rating))
                .ForMember(dest => dest.BrandId, source => source.MapFrom(source => source.BrandId))
                .ForMember(dest => dest.CategorieId, source => source.MapFrom(source => source.CategorieId))

                .ForMember(dest => dest.Stocks, source => source.MapFrom(source => source.Stocks));


            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name))
                .ForMember(dest => dest.Description, source => source.MapFrom(source => source.Description))
                .ForMember(dest => dest.Rating, source => source.MapFrom(source => source.Rating))
                .ForMember(dest => dest.BrandId, source => source.MapFrom(source => source.BrandId))
                .ForMember(dest => dest.CategorieId, source => source.MapFrom(source => source.CategorieId))
                .ForMember(dest => dest.Stocks, source => source.MapFrom(source => source.Stocks));
        }
    }


}