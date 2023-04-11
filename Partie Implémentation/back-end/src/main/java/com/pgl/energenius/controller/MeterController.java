package com.pgl.energenius.controller;


import com.pgl.energenius.Exception.InvalidUserDetailsException;
import com.pgl.energenius.Exception.ObjectNotFoundException;
import com.pgl.energenius.Exception.ObjectNotValidatedException;
import com.pgl.energenius.Exception.UnauthorizedAccessException;
import com.pgl.energenius.service.MeterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/meter")
@CrossOrigin("http://localhost:3000")
public class MeterController {

    @Autowired
    private MeterService meterService;

    @CrossOrigin("http://localhost:3000")
    @GetMapping("/all")
    public ResponseEntity<?> getMeters() {

        try {
            return new ResponseEntity<>(meterService.getAllMeters(), HttpStatus.OK);

        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (InvalidUserDetailsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    @PostMapping("/{EAN}/reading")
    public ResponseEntity<?> createReading(@PathVariable String EAN, @RequestParam String date, @RequestParam int value) {

        try {
            // Utilisation du constructeur Date (long) qui utilise des millisecondes pour créer la date.
            return new ResponseEntity<>(meterService.createReadingMeter(EAN, new Date(Long.parseLong(date)), value), HttpStatus.CREATED);

        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (UnauthorizedAccessException | InvalidUserDetailsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());

        } catch (ObjectNotValidatedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
