# STITCH_SCREEN_MAP.md — MaskSim UI Screen Map

## Approved Stitch Reference
- **Project ID**: `4255528054541198332`
- **Primary Result Screen (Node ID)**: `8e73c5bcf3ec4eafa224208df944b21e`
  - Title: *Analysis Result — MaskSim Forensics*
  - Preview: `https://stitch.withgoogle.com/preview/4255528054541198332?node-id=8e73c5bcf3ec4eafa224208df944b21e`
- **Home Screen (Node ID)**: `b0c1a893a70d44899ed936dedf091649`
  - Title: *Home — MaskSim*

---

## Route & Component Mapping

| Route | Page Component | Stitch Reference / Purpose | Key Subcomponents |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage.jsx` | Home `b0c1a893a70d44899ed936dedf091649` | Hero, PipelineOverview, MetricPreview, MiniUploadCTA |
| `/analyze` | `AnalyzePage.jsx` | Analysis Workspace & Upload | ImageDropzone, ImagePreview, LoadingState, ResultSummary |
| `/analysis/:id` | `AnalysisPage.jsx` | Result `8e73c5bcf3ec4eafa224208df944b21e` | ResultSummary, ScoreScale, ScientificVisualizationViewer, ForensicTabs, TechnicalMatrix |
| `/how-it-works` | `HowItWorksPage.jsx` | Educational pipeline | PipelineStepper, StepInspector, FlowDiagram |
| `/model` | `ModelPage.jsx` | Model technical specification | ArchitectureSummary, DnCNNParameters, MaskSimParameters |
| `/dataset` | `DatasetPage.jsx` | Provenance & splits | SplitProportionBars, MatchedPairCard, PreprocessingSpecs |
| `/performance` | `PerformancePage.jsx` | Evaluation metrics & matrices | ConfusionMatrix, MetricGrid, ROCContainer, LossCurves |
| `/history` | `HistoryPage.jsx` | User session history table | HistoryFilter, HistoryDataTable, HistoryPagination |
| `/limitations` | `LimitationsPage.jsx` | Forensic scope & boundaries | GeneratorScope, TransformationImpact, LegalDisclaimer |
| `/about` | `AboutPage.jsx` | Research background & architecture | ArchitectureDiagram, TechStack, ReferencePapers, Team |

---

## Shared Component Hierarchy

```text
App
├── AppShell
│   ├── Navbar
│   │   ├── BrandLogo & VersionBadge
│   │   ├── NavLinks (desktop & mobile)
│   │   └── AnalyzeCTA
│   ├── <PageContent>
│   └── Footer
│       ├── NavLinks
│       ├── Copyright
│       └── AnalyticalScopeDisclaimer
```
