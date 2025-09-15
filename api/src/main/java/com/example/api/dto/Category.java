package com.example.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class Category {
    private int score;
    private List<Tip> tips;
}

