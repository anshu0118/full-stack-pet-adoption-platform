package com.jackandpaws.config;

import com.jackandpaws.model.Pet;
import com.jackandpaws.repository.PetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import java.util.*;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(PetRepository repo) {
        return args -> {
            if (repo.count() > 0)
                return;
            List<Pet> pets = new ArrayList<>();
            pets.add(p("Bruno", Pet.Species.DOG, "Indie", 2, Pet.Gender.MALE, Pet.Size.MEDIUM, "Bhubaneswar",
                    "Bruno is friendly, energetic and happiest when he has people around. He enjoys walks and settles well after some exercise.",
                    Pet.EnergyLevel.HIGH, true, true, true, true, false,
                    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Luna", Pet.Species.CAT, "Domestic Shorthair", 3, Pet.Gender.FEMALE, Pet.Size.SMALL,
                    "Bhubaneswar",
                    "Luna is calm, curious and independent. She likes quiet corners, window watching and gentle attention.",
                    Pet.EnergyLevel.MEDIUM, true, true, true, false, true,
                    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Milo", Pet.Species.DOG, "Golden Retriever", 4, Pet.Gender.MALE, Pet.Size.LARGE, "Cuttack",
                    "Milo is social and people-oriented. He needs regular activity and would enjoy a home that likes getting outside.",
                    Pet.EnergyLevel.HIGH, true, true, true, true, true,
                    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=70"));
            pets.add(p("Coco", Pet.Species.CAT, "Persian Mix", 5, Pet.Gender.FEMALE, Pet.Size.SMALL, "Puri",
                    "Coco prefers a slower home and bonds closely with her people. She is affectionate once she knows you.",
                    Pet.EnergyLevel.LOW, true, true, true, false, false,
                    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Pepper", Pet.Species.DOG, "Beagle", 1, Pet.Gender.FEMALE, Pet.Size.MEDIUM, "Bhubaneswar",
                    "Pepper is young, playful and food-motivated. She will do best with patient adopters who enjoy training.",
                    Pet.EnergyLevel.HIGH, true, false, true, true, true,
                    "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Daisy", Pet.Species.DOG, "Labrador Mix", 6, Pet.Gender.FEMALE, Pet.Size.LARGE, "Cuttack",
                    "Daisy is gentle and steady. She likes people, short walks and being near the family without demanding constant attention.",
                    Pet.EnergyLevel.MEDIUM, true, true, true, true, true,
                    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Oreo", Pet.Species.CAT, "Domestic Shorthair", 2, Pet.Gender.MALE, Pet.Size.SMALL, "Puri",
                    "Oreo is playful but settles quickly. He is comfortable around calm dogs and likes interactive toys.",
                    Pet.EnergyLevel.MEDIUM, true, true, true, true, true,
                    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Rocky", Pet.Species.DOG, "Indie", 7, Pet.Gender.MALE, Pet.Size.MEDIUM, "Bhubaneswar",
                    "Rocky is an easy-going older dog who values routine, naps and a person who will give him time to settle.",
                    Pet.EnergyLevel.LOW, true, true, true, true, false,
                    "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=80"));
            pets.add(p("Nala", Pet.Species.CAT, "Calico", 1, Pet.Gender.FEMALE, Pet.Size.SMALL, "Bhubaneswar",
                    "Nala is curious and lively. She enjoys play sessions and would suit someone who wants an active young cat.",
                    Pet.EnergyLevel.HIGH, true, false, true, false, true,
                    "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=1000&q=80"));
            repo.saveAll(pets);
        };
    }

    private Pet p(String n, Pet.Species s, String b, int a, Pet.Gender g, Pet.Size z, String l, String d,
            Pet.EnergyLevel e, boolean v, boolean ne, boolean ch, boolean dogs, boolean cats, String img) {
        Pet p = new Pet();
        p.setName(n);
        p.setSpecies(s);
        p.setBreed(b);
        p.setAge(a);
        p.setGender(g);
        p.setSize(z);
        p.setLocation(l);
        p.setDescription(d);
        p.setEnergyLevel(e);
        p.setVaccinated(v);
        p.setNeutered(ne);
        p.setGoodWithChildren(ch);
        p.setGoodWithDogs(dogs);
        p.setGoodWithCats(cats);
        p.setImageUrl(img);
        return p;
    }
}
