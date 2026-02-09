package com.syncerpal.backend.location;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "locations")
public class Location {

  @Id
  private UUID id;

  @Column(name = "code")
  private String code;

  @Column(name = "name_en")
  private String nameEn;

  @Column(name = "name_ja")
  private String nameJa;

  public Location() {}

  // Get
  public UUID getId() {
    return id;
  }

  public String getCode() {
    return code;
  }

  public String getNameEn() {
    return nameEn;
  }

  public String getNameJa() {
    return nameJa;
  }

  // Set
  public void setId(UUID id) {
    this.id = id;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public void setNameEn(String nameEn) {
    this.nameEn = nameEn;
  }

  public void setNameJa(String nameJa) {
    this.nameJa = nameJa;
  }
}