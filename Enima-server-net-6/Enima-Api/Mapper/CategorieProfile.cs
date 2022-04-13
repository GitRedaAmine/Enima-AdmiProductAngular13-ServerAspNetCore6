using AutoMapper;
using Enima_Api.DTO;
using Repository.Core.Models;

namespace Enima_Api.Mapper
{
    public class CategorieProfile : Profile
    {
        public CategorieProfile()
        {
            CreateMap<CategorieDTO, Categorie>()
             .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
             .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name));



            CreateMap<Categorie, CategorieDTO>()
                .ForMember(dest => dest.uuid, source => source.MapFrom(source => source.uuid))
                .ForMember(dest => dest.Name, source => source.MapFrom(source => source.Name));
        }
    }

}