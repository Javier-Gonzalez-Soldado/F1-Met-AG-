package com.f1metag.Usuario.Models;

import com.f1metag.Equipo.Models.Equipo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue
     Long id;
    @Column(nullable = false)
     String nombre;
    @Column(nullable = false)
    String username;
    @Column(nullable = false)
    String email;
    @Column(nullable = false)
    String password;
    @Column
    Boolean estado;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "equipo_Id")
    @JsonIgnoreProperties({ "coches", "pilotos","usuarios" })
    @OnDelete(action = OnDeleteAction.CASCADE)
    Equipo equipo;

    @Enumerated(EnumType.STRING)
    Rol rol;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority((rol.name())));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
