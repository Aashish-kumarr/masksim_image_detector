const model = {
  name: "MaskSim SD1.4",
  version: "masksim-sd14-v1",
  inputSize: 512,
  colorSpace: "YCbCr",
  dncnnLayers: 20,
  dncnnParameters: 668227,
  maskSimParameters: 1572884,
  totalOptimizedParameters: 2241111,
  threshold: 0.5,
  generatorFocus: "Stable Diffusion 1.4",
};

const dataset = {
  realDataset: "RAISE-1k",
  syntheticDataset: "Synthbuster",
  generator: "Stable Diffusion 1.4",
  train: { real: 691, synthetic: 691, total: 1382 },
  validation: { real: 148, synthetic: 148, total: 296 },
  test: { real: 148, synthetic: 148, total: 296 },
};

const performance = {
  scope: "Held-out Stable Diffusion 1.4-focused test split",
  auc: 0.9825146092,
  accuracy: 0.9189189189,
  precision: 0.9025974026,
  recall: 0.9391891892,
  f1: 0.9205298013,
  confusionMatrix: [[133, 15], [9, 139]],
};

export function getModel(req, res) {
  res.json({ success: true, data: model, meta: { requestId: req.requestId } });
}

export function getDataset(req, res) {
  res.json({ success: true, data: dataset, meta: { requestId: req.requestId } });
}

export function getPerformance(req, res) {
  res.json({ success: true, data: performance, meta: { requestId: req.requestId } });
}

export function getArchitecture(req, res) {
  res.json({
    success: true,
    data: {
      layers: ["React", "Node.js / Express", "FastAPI", "PyTorch DnCNN + MaskSim"],
      flow: "React → Express → FastAPI → MaskSim",
    },
    meta: { requestId: req.requestId },
  });
}
