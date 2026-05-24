package com.distributedlab.labapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LabApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(LabApiApplication.class, args);
  }
}
