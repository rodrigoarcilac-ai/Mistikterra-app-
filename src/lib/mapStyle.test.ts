import { describe, expect, it } from "vitest";
import type { StyleSpecification } from "maplibre-gl";
import { SPANISH_NAME_FIELD, localizeStyleToSpanish } from "./mapStyle";

describe("localizeStyleToSpanish", () => {
  it("rewrites name labels to prefer Spanish and leaves road refs alone", () => {
    const style = {
      version: 8,
      sources: {},
      layers: [
        {
          id: "place_city",
          type: "symbol",
          source: "openmaptiles",
          layout: {
            "text-field": [
              "coalesce",
              ["get", "name_en"],
              ["get", "name"],
            ],
          },
        },
        {
          id: "highway_name_motorway",
          type: "symbol",
          source: "openmaptiles",
          layout: {
            "text-field": ["to-string", ["get", "ref"]],
          },
        },
      ],
    } as StyleSpecification;

    const localized = localizeStyleToSpanish(style);

    expect(localized.layers[0]).toMatchObject({
      layout: { "text-field": SPANISH_NAME_FIELD },
    });
    expect(localized.layers[1]).toMatchObject({
      layout: { "text-field": ["to-string", ["get", "ref"]] },
    });
    expect(style.layers[0]).toMatchObject({
      layout: {
        "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      },
    });
  });
});
