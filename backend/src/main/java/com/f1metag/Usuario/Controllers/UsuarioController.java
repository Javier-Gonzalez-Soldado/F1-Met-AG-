package com.f1metag.Usuario.Controllers;


import com.f1metag.Auth.AuthService;
import com.f1metag.Common.Requests.NoticiaRequest;
import com.f1metag.Common.Requests.UserRequest;
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

    @GetMapping("/{id}")
    public ApiResponse getUsuario(@PathVariable("id") Long id) {
        return ApiResponse.successRequest("Usuario obtenido correctamente", usuarioService.getUsuario(id)).getBody();
    }

    @GetMapping("/me")
    public ApiResponse getAuthenticatedUser() {
        return ApiResponse.successRequest("Usuario obtenido correctamente", usuarioService.getAuthenticatedUser()).getBody();
    }

    @PutMapping
    public ApiResponse updateUser(@RequestBody UserRequest userRequest){
        return ApiResponse.successRequest("Usuario actualizado correctamente", usuarioService.updateUser(userRequest)).getBody();
    }

    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable("id") Long id){
        usuarioService.deleteUser(id) ;
    }

}
