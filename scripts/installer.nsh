!macro customInstall
  ; Skip the prerequisite if the default Calibre installation is already present.
  IfFileExists "$PROGRAMFILES64\Calibre2\ebook-convert.exe" calibre_done
  IfFileExists "$PROGRAMFILES\Calibre2\ebook-convert.exe" calibre_done

  File /oname=$PLUGINSDIR\calibre-64bit-9.13.0.msi "${BUILD_RESOURCES_DIR}/../runtime/windows/calibre-64bit-9.13.0.msi"
  ExecWait '"$SYSDIR\msiexec.exe" /i "$PLUGINSDIR\calibre-64bit-9.13.0.msi"' $0
  IntCmp $0 0 calibre_done calibre_failed calibre_failed

calibre_failed:
  MessageBox MB_ICONSTOP "Calibre was not installed. Loki电子书转换器 needs Calibre's conversion engine to work."
  Abort

calibre_done:
!macroend
