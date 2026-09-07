package unpacker

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// ExtractZip unpacks a zip archive into a destination folder while protecting against Zip-Slip traversal.
func ExtractZip(zipFilePath string, destinationDir string) (string, error) {
	r, err := zip.OpenReader(zipFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to open zip file: %w", err)
	}
	defer r.Close()

	// If destinationDir is empty, extract into a folder named after the archive (without .zip)
	if destinationDir == "" {
		baseName := strings.TrimSuffix(filepath.Base(zipFilePath), filepath.Ext(zipFilePath))
		destinationDir = filepath.Join(filepath.Dir(zipFilePath), baseName)
	}

	destClean := filepath.Clean(destinationDir)
	if err := os.MkdirAll(destClean, 0755); err != nil {
		return "", fmt.Errorf("failed to create destination directory: %w", err)
	}

	for _, f := range r.File {
		targetPath := filepath.Join(destClean, f.Name)

		// Security: Prevent Zip-Slip directory traversal vulnerability
		if !strings.HasPrefix(filepath.Clean(targetPath), destClean+string(filepath.Separator)) && filepath.Clean(targetPath) != destClean {
			return "", fmt.Errorf("illegal file path in archive: %s", f.Name)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(targetPath, f.Mode())
			continue
		}

		if err := os.MkdirAll(filepath.Dir(targetPath), 0755); err != nil {
			return "", fmt.Errorf("failed to create directory for file %s: %w", f.Name, err)
		}

		outFile, err := os.OpenFile(targetPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return "", fmt.Errorf("failed to create extracted file %s: %w", f.Name, err)
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return "", fmt.Errorf("failed to read file from archive %s: %w", f.Name, err)
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		if err != nil {
			return "", fmt.Errorf("failed to write extracted file %s: %w", f.Name, err)
		}
	}

	return destClean, nil
}
