using AutoMapper;
using Enima_Api.DTO;
using Repository.Core.Models;

namespace Enima_Api.Mapper
{
    public class BrandProfile : Profile
    {
        public BrandProfile()
        {
        

            CreateMap<BrandDTO, Brand>()
              .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
              .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name));



            CreateMap<Brand, BrandDTO>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name));

        }
    }

}