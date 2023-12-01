package com.f1metag.Usuario.Controllers;


import com.f1metag.Auth.AuthService;
import com.f1metag.Common.Responses.ApiResponse;
import com.f1metag.Usuario.Models.Usuario;
import com.f1metag.Usuario.Services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor

public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    AuthService authService;

    @GetMapping
    public ApiResponse getUsuarios() {
        return ApiResponse.successRequest("Usuarios obtenidos correctamente", usuarioService.getAllUsers()).getBody();
    }

    @GetMapping("/me")
    public ApiResponse getAuthenticatedUser() {
        return ApiResponse.successRequest("Usuario obtenido correctamente", usuarioService.getAuthenticatedUser()).getBody();
    }

    @GetMapping("/solicitudes")
    public ApiResponse getUsuariosNoValidados(){
        return ApiResponse.successRequest("Usuarios no validados obtenidos correctamente", usuarioService.getNotValidatedUsers()).getBody();
    }

    @PutMapping("/solicitudes/responsable/{id}")
    public ApiResponse aceptarSolicitudResponsable(@PathVariable("id") Long id){
        return ApiResponse.successRequest("Usuario validado con rol de Responsable", usuarioService.actualizarResponsable(id)).getBody();
    }

    @PutMapping("/solicitudes/admin/{id}")
    public ApiResponse aceptarSolicitudAdmin(@PathVariable("id") Long id){
        return ApiResponse.successRequest("Usuario validado con rol de Administrador", usuarioService.actualizarAdmin(id)).getBody();
    }

    @DeleteMapping("/solicitudes/{id}")
    public ApiResponse rechazarSolicitud(@PathVariable("id") Long id){
        return ApiResponse.successRequest("Solicitud del usuario rechazada", usuarioService.rechazarSolicitud(id)).getBody();
    }
}
