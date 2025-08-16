#!/bin/bash
# filepath: /Users/fttg/fttg_workspace/choristercorner/scripts/update-version.sh

# Update version script
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/update-version.sh <version>"
  echo "Example: ./scripts/update-version.sh 1.0.3"
  exit 1
fi

echo "Updating to version $VERSION..."

# Update service worker cache names (simpler approach)
echo "Updating service worker cache names..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - use simpler patterns that work
  sed -i '' "s/'chorister-corner-v[0-9]*\.[0-9]*\.[0-9]*'/'chorister-corner-v$VERSION'/g" sw.js
  sed -i '' "s/'chorister-corner-data-v[0-9]*\.[0-9]*\.[0-9]*'/'chorister-corner-data-v$VERSION'/g" sw.js
else
  # Linux
  sed -i "s/'chorister-corner-v[0-9]*\.[0-9]*\.[0-9]*'/'chorister-corner-v$VERSION'/g" sw.js
  sed -i "s/'chorister-corner-data-v[0-9]*\.[0-9]*\.[0-9]*'/'chorister-corner-data-v$VERSION'/g" sw.js
fi

# Update app.json version (simpler pattern)
echo "Updating app.json version..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g" json/app.json
else
  # Linux  
  sed -i "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g" json/app.json
fi

# Update manifest.json version if it exists
if [ -f "manifest.json" ]; then
  echo "Updating manifest.json version..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g" manifest.json
  else
    # Linux
    sed -i "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g" manifest.json
  fi
fi

# Show what was updated
echo ""
echo "✅ Updated to version $VERSION"
echo "📝 Files updated:"
echo "   - sw.js (cache names)"
echo "   - json/app.json (version)"
if [ -f "manifest.json" ]; then
  echo "   - manifest.json (version)"
fi

echo ""
echo "🔍 Current cache names in sw.js:"
grep "const.*CACHE_NAME.*=" sw.js

echo ""
echo "🔍 All CACHE_NAME references in sw.js:"
grep "CACHE_NAME" sw.js

echo ""
echo "📄 Current version in app.json:"
grep "version" json/app.json

echo ""
echo "🚀 Next steps:"
echo "   1. Test your app locally"
echo "   2. Commit your changes: git add . && git commit -m 'Version $VERSION'"
   3. Deploy to your server"

echo ""
echo "Don't forget to test and commit your changes!"