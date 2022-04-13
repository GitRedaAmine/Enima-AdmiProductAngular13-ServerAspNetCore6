using AutoMapper;
using Enima_Api.DTO;
using Repository.Core.Models;

namespace Enima_Api.Mapper
{
    public class ImageUrlProfile : Profile
    {
        public ImageUrlProfile()
        {
            CreateMap<ImageUrlDTO, ImageUrl>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Url, source => source.MapFrom(source => source.Url)) 
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name))
                .ForMember(dest => dest.ProductId, source => source.MapFrom(source => source.ProductId));



            CreateMap<ImageUrl, ImageUrlDTO>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Url, source => source.MapFrom(source => source.Url)) 
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name))
                .ForMember(dest => dest.ProductId, source => source.MapFrom(source => source.ProductId));

        }
    }

}