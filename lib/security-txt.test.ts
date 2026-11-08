import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSecurityTxt, SECURITY_TXT_CONTENT_TYPE } from "./security-txt.ts";

test("security.txt advertises the public contact and canonical file", () => {
  const body = buildSecurityTxt("https://bdbeautyshop.com");

  assert.match(body, /^Contact: mailto:hello@bdbeautyshop\.com$/m);
  assert.match(body, /^Canonical: https:\/\/bdbeautyshop\.com\/\.well-known\/security\.txt$/m);
  assert.match(body, /^Preferred-Languages: en, bn$/m);
  assert.ok(body.endsWith("\n"));
});

test("security.txt content type is plain text", () => {
  assert.equal(SECURITY_TXT_CONTENT_TYPE, "text/plain; charset=utf-8");
});
