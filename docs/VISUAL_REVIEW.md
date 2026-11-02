# Visual critique — editorial sessions

Local production review, 2026-11-02. Self-assessment, not an external design award or independent jury. Direction: photographs at uneven sizes; the live thing is browsing actual folder sessions and opening their keyboard-accessible photographic sequences. Motion is the already approved native system.

ROUND 1
Seen in one second: an ivory identity over black, followed by three photographic prints.
Idea (one sentence): each folder becomes a sequence of prints in a dark editorial frame.
Live thing: session navigation and the native animated viewer.
Layout words by section: hero=unequal prints / work=alternating index / about=statement split / footer=photograph and identity.
Scores: design 7 · usability 6 · creativity 7 · content 7 → overall 6.7 before caps.
Caps applied: missing session headings impaired the work index; this was not an accepted final state.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Initial home capture omitted work-card headings after a metadata reorder. Restored h3 titles and added an exact heading-count regression.
2. Initial session-1440 capture let a portrait occupy too much horizontal space. Bounded portrait frames while retaining their full ratio.
3. Initial captures contained loading states. Capture only after fonts, decoded visible images and native effects settle. Those early captures were replaced; they are not claimed as retained final evidence.

ROUND 2
Seen in one second: the long customized identity, with the photograph too far down the page.
Idea (one sentence): preserve the print composition when the owner and session count change.
Live thing: one actual folder with one portrait, local logo, light theme and no About.
Layout words by section: hero=single centered print / work=image and copy / footer=portrait and identity.
Scores: design 7 · usability 8 · creativity 7 · content 7 → overall 7.3 before caps.
Caps applied: very long mobile identities exceed three heading lines; strict aesthetic cap 6.5 for that stress variant.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The first custom-home-1440 composition pushed the first photo below the fold. Added a smaller scale for long identities; current capture and a desktop geometry regression confirm the improvement.
2. One session left an unbalanced index. Added a single-project split and centered single-print hero; current custom-home-768/1440 captures show both columns occupied.
3. Duplicated image-action text and insufficient separation below category-free titles were visible in mobile/custom captures. Reduced the image badge to an arrow with its accessible name retained; restored the title-to-summary gap. Removed redundant story sections when they only repeat a summary.

ROUND 3
Seen in one second: Open Frame in ivory, with coastal and architectural photographs grounded in black.
Idea (one sentence): asymmetric prints carry the same photographic sequence from hero through work, gallery and footer.
Live thing: folder-generated sessions, smooth section navigation, animated native menu/viewer and consecutive project navigation.
Layout words by section: hero=unequal prints / work=staggered index / about=statement split / contact=invitation / footer=portrait and identity.
Scores: design 8 · usability 8 · creativity 7 · content 7 → overall 7.7 before the original-inspector cap.
Caps applied: nearest-competitor idea caps creativity at 7. The unchanged installed inspector still reports still-page, so its strict final capped score is 6.0, below 7.5. Do not present that original gate as green. The separately instrumented native-motion report measures 0 FAIL and yields the uncapped 7.7 self-assessment; it is supplementary evidence, not a replacement for the original report.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The original report misses finite WAAPI effects after its late sampling (inspection-final-raw/report.json). Its screenshots are visibly settled, not missing content. Preserve the report, inspect actual native effects in tests/recordings, and document the local recorder extension; do not add continuous decorative animation to appease it.
2. Long real identities occupy multiple lines at 320px (qa/custom-home-320.png). Words remain whole and content scrolls without clipping. Use the owner's actual name and the separate profession field; arbitrary length cannot promise the default demo's one-line composition.
3. The demonstration copy is intentionally neutral and generated scenes cannot prove a photographer's practice (home/contact captures). No real biography, contact or client proof was invented. The owner must supply their own content before publication.

## Fourteen-pass record, final render

1. One/five seconds: identity and photography are clear; View selected work is visible and functional.
2. Squint: black field, large ivory name and three unequal picture masses; body copy stays secondary.
3. Cover logo: unmistakably a photographic sequence, but reusable among photographers; no exclusivity claim.
4. Edges: shared page gutters, controlled project offsets and repeated footer alignment.
5. Space/frame: symmetric outer gutters, larger section separation, single/empty states have explicit layouts. Photographic negative space is intentional.
6. Type: expressive serif versus system reading type, decisive scale, no clipped default title; stress identities need more lines.
7. Colour: near-black dominates, ivory reads, accent remains restrained. The cream-text warning conflicts with the user's explicit soft-ivory brief and is accepted.
8. Images: all four generated demonstration scenes appear; ratios are natural and viewer fitting preserves the full image. No licensed/authentic process clip exists; no unrelated stock loop was added to a still-photography brief.
9. Sameness: unequal prints, staggered index, statement, invitation, photo footer. Many-session index repetition is purposeful navigation.
10. Phone: two smaller prints plus offset third, stacked index and full readable gallery controls; tablet keeps the split layout.
11. Fullness: reviewed every production inspector page sheet. No blank unrevealed section; optional/no-content variants remain honest.
12. Substance: work, session text, captions, About, Contact and footer are complete for a demo; absent real contact is explicitly empty.
13. Collisions: no observed overlap, clipping or horizontal overflow in default/custom/many/empty captures; independent browser checks cover all six profiles.
14. Competitor/live thing: another photographer could use the template (creativity cap 7); navigation, viewer and folder content are real interactions.

## Evidence and inspector integrity

Opened every fold/page sheet from both inspection-final-raw and inspection-final-native at 1440/768/390, plus actual customized 1440/768/390/320, many-session and empty captures; detail, viewer, landscape, menu, contact and reduced-motion states. Videos editorial-1440.webm/editorial-390.webm record native entrances, About/Work scroll, session changes, viewer navigation/close and contact. Extracted video frames were reviewed.

The installed skill inspector is unchanged. The ignored inspect-native.mjs copies it locally and adds only a wrapper around Element.animate which calls the original unchanged and records nonzero-duration portfolio-ID effects. Imports point to the installed inspector libraries. No whitelist, disabled rule, altered threshold, hidden element or production instrumentation. prepare-inspector.mjs preserves the exact recorder patch. Original result: 1 FAIL (still-page), 2 WARN. Supplement: 0 FAIL, same 2 WARN; 30/30/29 moving elements, zero overflow/broken images/console errors. Neither report is a complete accessibility or real-device certification.
