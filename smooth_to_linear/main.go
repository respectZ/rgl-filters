package main

import (
	"path/filepath"

	"github.com/respectZ/glowstone"
	g_util "github.com/respectZ/glowstone/util"
)

func main() {
	project := glowstone.NewProject()
	project.RP.Path = filepath.Join("RP")
	project.BP.Path = filepath.Join("BP")

	files, err := g_util.Walk(filepath.Join(project.RP.Path, "animations"))
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		animFile, err := project.RP.Animation.Load(file)
		if err != nil {
			panic(err)
		}
		for _, v := range animFile.Data.Animations.All() {
			if v.Loop == nil {
				continue
			}
			if v.Loop != "hold_on_last_frame" {
				continue
			}

			for _, v := range v.Bones {
				// We which timeline is map to a object
				data_interface, ok := v.Position.(map[string]interface{})
				if !ok {
					continue
				}
				for k, vv := range data_interface {
					r, ok := vv.(map[string]interface{})
					if ok {
						// It's a catmull rom.
						// v.Position.(map[string]interface{})[k] = r["post"]
						data_interface[k] = r["post"]
						v.Position = data_interface
					}
				}
			}

			for _, v := range v.Bones {
				// We which timeline is map to a object
				data_interface, ok := v.Rotation.(map[string]interface{})
				if !ok {
					continue
				}
				for k, vv := range data_interface {
					r, ok := vv.(map[string]interface{})
					if ok {
						// It's a catmull rom.
						// v.Rotation.(map[string]interface{})[k] = r["post"]
						data_interface[k] = r["post"]
						v.Rotation = data_interface
					}
				}
			}
		}
	}

	project.Save()
}
