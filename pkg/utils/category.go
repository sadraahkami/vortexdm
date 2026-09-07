package utils

import (
	"path/filepath"
	"strings"
)

type Category string

const (
	CategoryVideo    Category = "video"
	CategoryAudio    Category = "audio"
	CategoryDocument Category = "document"
	CategorySoftware Category = "software"
	CategoryArchive  Category = "archive"
	CategoryOther    Category = "other"
)

var extensionMap = map[string]Category{
	// Video
	".mp4":  CategoryVideo,
	".mkv":  CategoryVideo,
	".mov":  CategoryVideo,
	".avi":  CategoryVideo,
	".webm": CategoryVideo,
	".flv":  CategoryVideo,
	".wmv":  CategoryVideo,

	// Audio
	".mp3":  CategoryAudio,
	".flac": CategoryAudio,
	".wav":  CategoryAudio,
	".ogg":  CategoryAudio,
	".m4a":  CategoryAudio,
	".aac":  CategoryAudio,

	// Document
	".pdf":  CategoryDocument,
	".doc":  CategoryDocument,
	".docx": CategoryDocument,
	".xls":  CategoryDocument,
	".xlsx": CategoryDocument,
	".ppt":  CategoryDocument,
	".pptx": CategoryDocument,
	".txt":  CategoryDocument,
	".epub": CategoryDocument,

	// Software
	".exe": CategorySoftware,
	".msi": CategorySoftware,
	".apk": CategorySoftware,
	".dmg": CategorySoftware,
	".deb": CategorySoftware,
	".rpm": CategorySoftware,
	".iso": CategorySoftware,

	// Archive
	".zip": CategoryArchive,
	".rar": CategoryArchive,
	".7z":  CategoryArchive,
	".tar": CategoryArchive,
	".gz":  CategoryArchive,
	".bz2": CategoryArchive,
}

// DetectCategory determines the file category based on its filename or extension.
func DetectCategory(filename string) Category {
	ext := strings.ToLower(filepath.Ext(filename))
	if cat, found := extensionMap[ext]; found {
		return cat
	}
	return CategoryOther
}
