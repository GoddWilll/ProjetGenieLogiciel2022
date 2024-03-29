package com.pgl.energenius.controller;


import com.pgl.energenius.config.JwtUtil;
import com.pgl.energenius.exception.*;
import com.pgl.energenius.model.ClientLogin;
import com.pgl.energenius.model.SupplierLogin;
import com.pgl.energenius.model.dto.ClientDto;
import com.pgl.energenius.model.dto.ClientLoginDto;
import com.pgl.energenius.model.dto.SupplierLoginDto;
import com.pgl.energenius.service.*;
import com.pgl.energenius.utils.SecurityUtils;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SupplierService supplierService;

    /**
     * POST method to register a new client.
     *
     * @param clientDto The client's information.
     * @return A message indicating that the registration has been successfully completed.
     */
    @PostMapping("/client/register")
    public ResponseEntity<?> register(@RequestBody ClientDto clientDto) throws Exception {

        return new ResponseEntity<>(clientService.createClient(clientDto), HttpStatus.CREATED);
    }

    /**
     * POST method to log in the client.
     *
     * @param clientLoginDto The client's login credentials.
     * @return A ResponseEntity containing the client's login information and the authentication token.
     */
    @PostMapping("/client/login")
    public ResponseEntity<?> login(@RequestBody ClientLoginDto clientLoginDto) {

        try {
            ClientLogin clientLogin = clientService.authenticateClient(clientLoginDto);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(clientLogin))
                    .body(clientLogin.getClient().getId());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
        }
    }

    /**
     * POST method to send a reset password request by mail
     *
     * @param email The user's email
     * @return OK if the email was sent
     */
    @PostMapping("/client/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email) throws ObjectNotFoundException {

        try {
            userService.resetPasswordClient(email, jwtUtil.generatePasswordResetToken(email));
            return ResponseEntity.ok().body("Email sent");

        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Couldn't send an email to this email: " + email);
        }
    }

    /**
     * PUT method to change the current password with a new password
     *
     * @param newPassword The user's new password
     * @param token the token used to validate the user trying to change the password
     * @return OK if the password was changed
     */
    @PutMapping("/client/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String newPassword, @RequestParam String token) {

        try {
            if (!jwtUtil.validatePasswordResetToken(token))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");

            userService.changePasswordClient(jwtUtil.getUsernameFromToken(token), newPassword);
            return ResponseEntity.ok().build();

        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * POST method to log in the employee.
     *
     * @param supplierLoginDto The employee's login credentials.
     * @return A ResponseEntity containing the employee's login information and the authentication token.
     */
    @PostMapping("/employee/login")
    public ResponseEntity<?> login(@RequestBody SupplierLoginDto supplierLoginDto) {

        try {
            SupplierLogin supplierLogin = supplierService.authenticateSupplier(supplierLoginDto);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(supplierLogin))
                    .body(supplierLogin.getSupplier());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
        }
    }

    /**
     * GET method to verify that the token is expired or not
     *
     * @param token the token to verify
     * @return True, if the token is not expired. False, otherwise
     */
    @GetMapping("/expired_token")
    public ResponseEntity<?> isTokenExpired(@RequestParam String token) {

        try {
            return new ResponseEntity<>(jwtUtil.isTokenExpired(token), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
