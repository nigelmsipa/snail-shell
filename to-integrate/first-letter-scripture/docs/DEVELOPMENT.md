# Development Guide

## Pre-commit Hooks Setup

This project uses Husky to run type checks before commits, preventing build-breaking errors from being committed.

### First-time Setup

After cloning the repository, run:

```bash
# Install dependencies (includes husky)
npm install

# Initialize husky hooks
npx husky install

# Make the pre-commit hook executable (if not already)
chmod +x .husky/pre-commit
```

### What Happens on Commit

When you run `git commit`, the pre-commit hook will automatically:
1. ✅ Run TypeScript type checking
2. ✅ Verify all exports and imports are valid
3. ✅ Catch index/data file mismatches
4. ❌ Block the commit if errors are found

### Manual Type Check

You can manually run the type check at any time:

```bash
npm run build -- --mode development
```

### Verify Export Consistency

To check for export/import mismatches in pericope files:

```bash
npx ts-node scripts/verify-exports.ts
```

## Continuous Integration

### GitHub Actions

The project includes a CI workflow that runs on every push and pull request:

- **Type Check**: Validates TypeScript compilation
- **Build**: Ensures the project builds successfully
- **Reports**: Fails the CI build if errors are detected

### Workflow File

See `.github/workflows/typecheck.yml` for the CI configuration.

### Bypassing Hooks (Emergency Only)

If you absolutely must commit without running checks:

```bash
git commit --no-verify -m "your message"
```

⚠️ **Warning**: This should only be used in emergencies and the issues must be fixed in the next commit.

## Common Issues

### Issue: Hook not executing

**Solution**: Make sure the hook is executable:
```bash
chmod +x .husky/pre-commit
```

### Issue: Type check failing

**Solution**: Fix the TypeScript errors before committing. Common issues:
- Missing exports in pericope data files
- Mismatched import/export names in index files
- Invalid TypeScript syntax

### Issue: Husky not installed

**Solution**: Run the setup commands:
```bash
npm install
npx husky install
```

## Best Practices

1. **Run checks before committing**: Get in the habit of running `npm run build` before committing
2. **Fix errors immediately**: Don't let type errors accumulate
3. **Keep data files in sync**: When adding new pericope chapters, update both the data file and index
4. **Use the validation script**: Run `verify-exports.ts` after adding new pericope files
