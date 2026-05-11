#!/bin/sh
cd ~/ish-dev || exit
echo "[SYSTEM v5 SELF-LEARNING START]"

# 1. Intelligence Pipeline
sh agents/ai-planner.sh     # Plan
sh agents/ai-coder.sh       # Code
sh agents/ai-reviewer.sh    # QA

# 2. Safety & Quality Gates
sh ast/ast-check.sh         # Semantic validation
sh scripts/bug-detector.sh  # Auto detection
sh scripts/fixer.sh         # Deterministic fix
sh scripts/validator.sh     # Final check

# 3. Self-Learning Loop
sh scoring/scorer.sh        # Score result
sh feedback/feedback.sh     # Auto-generate fixes if score is low
sh learning/improve.sh      # System evolution

# 4. Finalization
sh scripts/memory.sh        # Update project memory
sh scripts/version.sh       # Increment version
sh scripts/git-commit.sh    # Push results
echo "[SYSTEM v5 COMPLETE]"