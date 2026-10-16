# Contributing to ai-product-manager

Thank you for your interest in contributing! This guide explains how to get involved.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/ChanMeng666/ai-product-manager-skill/issues/new/choose) with:

- Steps to reproduce the problem
- Expected vs. actual behavior (screenshots or logs help)
- Your environment (OS, and relevant runtime/version)

### Suggesting Features

Have an idea? [Open a feature request](https://github.com/ChanMeng666/ai-product-manager-skill/issues/new/choose) describing the problem you want to solve and your proposed solution.

### Submitting Changes

1. **Fork** the repository and **clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/ai-product-manager-skill.git
   cd ai-product-manager-skill
   ```
2. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and verify them locally (see Development Setup below).
4. **Commit** with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: short description of your change"
   ```
5. **Push** and open a Pull Request against the `main` branch.

## Development Setup

The skill is plain Markdown. The only tooling is a zero-dependency Node.js (18+) validator:

```bash
node scripts/validate.mjs
```

Link your working copy into Claude Code to try changes live:

```bash
ln -s "$(pwd)/skills/ai-product-manager" ~/.claude/skills/ai-product-manager
```

### What makes a good contribution

- **Field lessons.** A pitfall, case or decision drill from a real AI project. Explain the symptom,
  why it kills projects, and the fix. Anonymize clients.
- **Better evidence.** Public research with a source URL and an honest caveat.
- **New templates.** Keep them to one page. If a gate doesn't fit on a page, the judgment isn't
  clear yet.
- **Eval cases.** A realistic prompt plus objectively checkable assertions in `evals/evals.json`.

If you change skill behavior, re-run the eval prompts with and without the skill and update
`evals/benchmark.md`.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). For questions or
support, see [SUPPORT.md](SUPPORT.md). For security issues, see [SECURITY.md](SECURITY.md).
