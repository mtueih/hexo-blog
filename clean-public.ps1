if (!(Test-Path -Path public)) {
    exit;
}

rm -r public/img;
mv public/css/* public/styles;
mv public/js/* public/scripts;

$htmlFiles = Get-ChildItem -Path public -Recurse -Filter *.html;

foreach ($htmlFile in $htmlFiles) {
    $htmlContent = Get-Content $htmlFile.FullName;
    $htmlContent = $htmlContent -replace "href=`"/css/", "href=`"/styles/";
    $htmlContent = $htmlContent -replace "src=`"/js/", "src=`"/scripts/";
    Set-Content -Path $htmlFile.FullName -Value $htmlContent;
}

