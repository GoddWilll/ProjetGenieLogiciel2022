package com.pgl.energenius.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "logins")
public abstract class User implements UserDetails {

    /**
     * The password used by the user
     */
    @JsonIgnore
    private String password;

    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Check if the account isn't expired
     * @return
     */
    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Check if the account isn't locked
     * @return
     */
    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Check if the credential information aren't expired
     * @return
     */
    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Check if the account is enabled
     * @return
     */
    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }
}
