package com.pgl.energenius.model.dto;

import com.pgl.energenius.enums.EnergyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleOfferDto extends OfferDto {

    private double cost;

    private double nightCost;

    private EnergyType energyType;
}
