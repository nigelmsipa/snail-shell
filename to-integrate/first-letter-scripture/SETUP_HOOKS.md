# Pre-commit Hooks Setup Instructions

✅ **Husky and hooks have been configured!**

## What's been set up:

1. ✅ Husky dependency added
2. ✅ Pre-commit hook created (`.husky/pre-commit`)
3. ✅ GitHub Actions CI workflow (`.github/workflows/typecheck.yml`)
4. ✅ Export verification script (`scripts/verify-exports.ts`)
5. ✅ ts-node dependency added

## Required package.json scripts:

The following scripts need to be added to your `package.json` (these are automatically managed by Lovable):

```json
{
  "scripts": {
    "prepare": "node .husky/install.mjs",
    "typecheck": "tsc --noEmit",
    "verify-exports": "ts-node scripts/verify-exports.ts"
  }
}
```

## How it works:

### Pre-commit Hook
When you commit code, the hook will automatically:
1. Run `npm run typecheck` - TypeScript type checking
2. Block the commit if errors are found
3. Display helpful error messages

### GitHub Actions CI
On every push/PR to main or develop branches:
1. Runs TypeScript type checking
2. Verifies export consistency
3. Reports failures with detailed logs

## Manual Testing

You can test the hooks manually:

```bash
# Test type checking
npm run typecheck

# Test export verification
npm run verify-exports

# Test the pre-commit hook
.husky/pre-commit
```

## What happens next?

- ✅ Future commits will be automatically validated
- ✅ Build errors will be caught before they reach the repository
- ✅ Export mismatches will be detected immediately
- ✅ CI will run on all pull requests

## Bypassing (Emergency Only)

If absolutely necessary:
```bash
git commit --no-verify -m "emergency fix"
```

⚠️ Use sparingly and fix issues in the next commit!

## Files Created

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/_/husky.sh` - Husky helper script
- `.husky/install.mjs` - Husky initialization
- `.github/workflows/typecheck.yml` - CI workflow
- `scripts/verify-exports.ts` - Export validation script
- `docs/DEVELOPMENT.md` - Development guide

## Need Help?

See `docs/DEVELOPMENT.md` for detailed troubleshooting and best practices.
