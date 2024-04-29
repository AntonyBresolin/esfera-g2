package com.esfera.g2.esferag2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MappingController {
    @GetMapping("/")
    public String start() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("selectedScreen", "dashboard");
        return "home";
    }



    @GetMapping("/configuration")
    public String configuration(Model model) {
        model.addAttribute("selectedScreen", "configuration");
        return "configuration";
    }
}
