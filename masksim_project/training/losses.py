import torch
import torch.nn.functional as F


def masksim_training_loss(masksim, spectrum, labels):
    """
    Training loss with the abs-cosine trick described in the paper.

    FAKE (label=1): use normal cosine similarity  → model is pushed to be similar to ref
    REAL (label=0): use |cosine| similarity        → model is pushed toward zero cosine

    This asymmetry is ONLY used during training.
    Validation / inference use standard cosine (masksim.forward()).
    """
    similarity = masksim.similarity(spectrum)          # shape [B]

    # Abs-cosine training trick
    train_similarity = (
        similarity * labels
        + similarity.abs() * (1.0 - labels)
    )

    probability = torch.sigmoid(
        torch.exp(masksim.a) * train_similarity + masksim.b
    ).clamp(1e-6, 1.0 - 1e-6)

    return F.binary_cross_entropy(probability, labels)
