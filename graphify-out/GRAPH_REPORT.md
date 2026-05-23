# Graph Report - .  (2026-05-24)

## Corpus Check
- 15 files · ~17,314 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 55 nodes · 68 edges · 17 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `build_exam()` - 13 edges
2. `detect_radio_rects()` - 4 edges
3. `detect_blank_rects()` - 4 edges
4. `build_document_sheet()` - 4 edges
5. `clean()` - 3 edges
6. `page_content_crop()` - 3 edges
7. `page_has_meaningful_content()` - 3 edges
8. `dedupe_rects()` - 3 edges
9. `match_answer()` - 3 edges
10. `main()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `build_exam()` --calls--> `page_content_crop()`  [EXTRACTED]
  scripts\build_exam_assets.py → scripts\build_exam_assets.py  _Bridges community 0 → community 3_
- `build_exam()` --calls--> `detect_radio_rects()`  [EXTRACTED]
  scripts\build_exam_assets.py → scripts\build_exam_assets.py  _Bridges community 6 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.36
Nodes (7): build_document_sheet(), chunks(), DocumentSource, ExamSource, main(), page_content_crop(), page_has_meaningful_content()

### Community 1 - "Community 1"
Cohesion: 0.39
Nodes (4): emptyState(), loadState(), resetExam(), storageKey()

### Community 2 - "Community 2"
Cohesion: 0.32
Nodes (3): buildFillFeedback(), evaluateFillAnswer(), normalizeAnswer()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (7): add_aliases(), build_exam(), clean(), extract_option_texts(), match_answer(), rect_to_dict(), shift_rect()

### Community 4 - "Community 4"
Cohesion: 0.47
Nodes (3): PageCanvas(), pageChoiceGroups(), pageFillGroups()

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (2): ExamAssetRenderingTest, load_asset_builder()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (3): dedupe_rects(), detect_blank_rects(), detect_radio_rects()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **2 isolated node(s):** `ExamSource`, `DocumentSource`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (2 nodes): `App()`, `App.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `FeedbackPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `examTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `2024-resit.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `2024.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `2025-resit.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `examLogic.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `examManifest.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `build_exam()` connect `Community 3` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `ExamSource`, `DocumentSource` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._