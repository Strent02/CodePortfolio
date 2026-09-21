#!/bin/zsh
set -euo pipefail

SOURCE_DIR="/Users/agent/CodePortfolio/CodePortfolio/documentacion/plan_y_plantilla_pruebas"
DESKTOP_DIR="/Users/agent/Desktop/Plan_y_Plantilla_Pruebas_CodePortfolio"
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

mkdir -p "$DESKTOP_DIR"

for html_file in "$SOURCE_DIR"/*.html; do
  base_name="${html_file%.html}"
  docx_file="${base_name}.docx"
  pdf_file="${base_name}.pdf"
  docx_temp="${base_name}.rendering.docx"
  pdf_temp="${base_name}.rendering.pdf"

  [[ -e "$docx_temp" ]] && /bin/rm -f "$docx_temp"
  [[ -e "$pdf_temp" ]] && /bin/rm -f "$pdf_temp"

  textutil -convert docx \
    -title "CodePortfolio — Pruebas de software" \
    -author "Pedro Bonilla" \
    -company "CodePortfolio" \
    -output "$docx_temp" "$html_file"
  mv -f "$docx_temp" "$docx_file"

  chrome_profile="$(mktemp -d /private/tmp/codeportfolio-tests-render.XXXXXX)"
  "$CHROME_BIN" \
    --headless=new \
    --disable-gpu \
    --disable-background-mode \
    --disable-background-networking \
    --disable-component-update \
    --disable-default-apps \
    --disable-extensions \
    --no-first-run \
    --no-default-browser-check \
    --user-data-dir="$chrome_profile" \
    --no-pdf-header-footer \
    --print-to-pdf="$pdf_temp" \
    "file://$html_file" >/dev/null 2>&1 &
  chrome_pid=$!

  rendered=false
  for _ in {1..160}; do
    if [[ -s "$pdf_temp" ]]; then
      rendered=true
      break
    fi
    sleep 0.25
  done
  kill "$chrome_pid" 2>/dev/null || true
  wait "$chrome_pid" 2>/dev/null || true
  if [[ "$rendered" != true ]]; then
    echo "No se pudo generar $pdf_file" >&2
    exit 1
  fi
  mv -f "$pdf_temp" "$pdf_file"

  ditto "$docx_file" "$DESKTOP_DIR/${docx_file:t}"
  ditto "$pdf_file" "$DESKTOP_DIR/${pdf_file:t}"
done

find "$DESKTOP_DIR" -maxdepth 1 -type f -print | sort
