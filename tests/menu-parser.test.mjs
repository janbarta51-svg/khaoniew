import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseMenuPayload } from "../app/menu-parser.ts";

test("parses the one-field Pages CMS menu", async () => {
  const source = JSON.parse(await readFile(new URL("../pages-cms-setup/weekly-menu.json", import.meta.url), "utf8"));
  const menu = parseMenuPayload(source);

  assert.ok(menu);
  assert.equal(menu.weekStart, "2026-08-24");
  assert.deepEqual(menu.prices, { set: 189, soup: 25, main: 165, dessert: 20 });
  assert.equal(menu.days.length, 5);
  assert.equal(menu.days[0].soup.name, "TOMYAM KAI");
  assert.equal(menu.days[0].meals.length, 4);
  assert.equal(menu.days[0].meals[0].name, "KAI GROB KARI");
  assert.equal(menu.days[0].meals[0].allergens, "1, 4, 6, 11, 12");
  assert.equal(menu.days[2].meals[3].name, "YAM SEN SAI TOFU");
  assert.equal(menu.days[4].dessert.name, "Buchta");
});
