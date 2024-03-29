package com.f1metag.Piloto.Services;

import com.f1metag.Common.Requests.PilotoRequest;
import com.f1metag.Common.Responses.ApiResponse;
import com.f1metag.Equipo.Repository.EquipoRepository;
import com.f1metag.Piloto.Models.Piloto;
import com.f1metag.Piloto.Repositories.PilotoRepository;
import com.f1metag.Usuario.Models.Usuario;
import com.f1metag.Usuario.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PilotoService {
    @Autowired
    PilotoRepository pilotoRepository;

    @Autowired
    EquipoRepository equipoRepository;

    @Autowired
    UsuarioService usuarioService;

    public ApiResponse createPiloto(PilotoRequest pilotoRequest) {

        if(equipoRepository.findById(pilotoRequest.getEquipo_id()).isEmpty()) {
            return ApiResponse.errorRequest("El equipo no existe.").getBody();
        }

        Piloto piloto = Piloto.builder()
                .nombre(pilotoRequest.getNombre())
                .apellidos(pilotoRequest.getApellidos())
                .siglas(pilotoRequest.getSiglas())
                .dorsal(pilotoRequest.getDorsal())
                .foto(pilotoRequest.getFoto())
                .twitter(pilotoRequest.getTwitter())
                .pais(pilotoRequest.getPais())
                .equipo(equipoRepository.findById(pilotoRequest.getEquipo_id()).get())
                .activo(true)
                .build();

        pilotoRepository.save(piloto);

        return ApiResponse.successRequest("Piloto creado correctamente", piloto).getBody();
    }

    public ApiResponse getPilotos() {
        return ApiResponse.successRequest("Pilotos obtenidos correctamente", pilotoRepository.findAll()).getBody();
    }

    public ApiResponse updatePiloto(PilotoRequest pilotoRequest,Long id){
        Optional<Piloto> optional = pilotoRepository.findById(id);
        if(optional.isPresent()){
            Piloto piloto = optional.get();

            piloto.setNombre(pilotoRequest.getNombre());
            piloto.setApellidos(pilotoRequest.getApellidos());
            piloto.setSiglas(pilotoRequest.getSiglas());
            piloto.setDorsal(pilotoRequest.getDorsal());
            piloto.setFoto(pilotoRequest.getFoto());
            piloto.setTwitter(pilotoRequest.getTwitter());
            piloto.setPais(pilotoRequest.getPais());
            piloto.setEquipo(equipoRepository.findById(pilotoRequest.getEquipo_id()).get());

            pilotoRepository.save(piloto);
            return ApiResponse.successRequest("Piloto editado correctamente", piloto).getBody();

        }

        return ApiResponse.badRequest().getBody();

    }

    public ApiResponse deletePiloto(Long id){

        pilotoRepository.deleteById(id);
        return ApiResponse.successRequest("Piloto eliminado correctamente", id).getBody();

    }

    public ApiResponse getPilotoById(Long id){

        Optional<Piloto> optional = pilotoRepository.findById(id);
        if(optional.isPresent()){
            Piloto piloto = optional.get();
            return ApiResponse.successRequest("Piloto encontrado", piloto).getBody();
        }
        return ApiResponse.errorRequest("El piloto no existe").getBody();

    }

    public ApiResponse getPilotosEquipo(){
        Usuario usuarioAuten = usuarioService.getAuthenticatedUser();
        if(usuarioAuten.getEquipo() == null)
            return ApiResponse.errorRequest("El usuario no pertenece a ningún equipo").getBody();

        return ApiResponse.successRequest("Pilotos Obtenidos correctamente!", usuarioAuten.getEquipo().getPilotos()).getBody();
    }

}