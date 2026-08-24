# Camera-ready revision notes (Plan A)

Maps each CONESCAPAN review request to the manuscript change. **No new trial numbers were invented.** Existing counts remain 3 student participants, 50 fall-like trials, 80 non-fall trials.

## Scientific review

| Reviewer request | Where addressed | What we did **not** do |
|---|---|---|
| Larger / more diverse participants | §Experimental Methodology (disclosure); §Limitations (prototype baseline; proposed ≥15-worker protocol) | Did not add fake participants or new sensitivity/specificity |
| Threshold vs. learning-based methods | §State of the Art + Table I with **published** Wu, CareFall, Qian figures; explicit non-comparability caveat | Did not train or report an on-helmet ML model |
| Robustness under working environments | §Results, “Environmental robustness (preliminary)” | Did not split Table II into indoor/outdoor (that log was never reported) |
| Deployment, scalability, privacy, cybersecurity | §Deployment, Scalability, Privacy, and Cybersecurity | Did not claim production controls already exist |

## Reference audit

| Orig. | Checker | Action |
|---|---|---|
| [1] OSHA | Wrong JSTOR DOI (`10.2307/j.ctvn5tvk1.12`) | Cite **BLS TED** for 389 / 1,034 / 95.9% lower-level; keep OSHA campaign **without** that DOI |
| [2] NIOSH | Wrong *Nursing Older People* DOI | Keep NIOSH bulletin URL; authors as listed on the CDC page |
| [3] Ramachandran | Verified | Unchanged (doi: 10.1155/2020/2167160) |
| [4] Wu | Verified | Unchanged (doi: 10.1155/2015/576364); quoted 97.1/98.3 vs 91.6/88.7 from that paper |
| [5] CareFall arXiv | Metadata mismatch | Replaced with CEUR WAMWB 2023 Vol. 3517, pp. 51–57, `https://ceur-ws.org/Vol-3517/paper4.pdf`. Erciyes numbers from that PDF |
| [6] Qian | Verified | Kept; pages 21999–22007, vol. 9, no. 21 |
| [7] Campero-Jurado | Verified | Unchanged (doi: 10.3390/s20216241) |
| [8] MPU-6050 | Not in Crossref | Kept as manufacturer spec (expected) |
| [9] ESP-NOW IDF | Wrong Zenodo match | Pinned ESP-IDF **v5.4** HTML; no Zenodo DOI |
| [10] ESP-FAQ | Not found | Merged into the v5.4 ESP-NOW cite |
| [11] Socket.IO | Not found | Kept as v4 Server API docs |
| [12]–[13] Supabase | Not found | Merged into one Storage guide cite |

## Other

- Acknowledgment: “The author” → “The authors”
- Page count: 6 pages (IEEE conference)

## Build

```bash
cd paper && pdflatex casco.tex && pdflatex casco.tex
```
