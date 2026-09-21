package com.jackandpaws.controller;

import com.jackandpaws.model.Pet;
import com.jackandpaws.service.FavoriteService;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    final FavoriteService s;

    public FavoriteController(FavoriteService s) {
        this.s = s;
    }

    @GetMapping
    public List<Pet> list() {
        return s.list();
    }

    @PostMapping("/{petId}")
    public ResponseEntity<Void> add(@PathVariable Long petId) {
        s.add(petId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> remove(@PathVariable Long petId) {
        s.remove(petId);
        return ResponseEntity.noContent().build();
    }
}
