export const DEFAULT_SAVE = {
    "dependencies": {
    },
    "blocks": {
        "languageVersion": 0, "blocks": [
            { "type": "arduino_setup", "id": "arduino_setup_id0", "x": 30, "y": 30 },
            { "type": "arduino_loop", "id": "arduino_loop_id0", "x": 330, "y": 30 }
        ]
    }
}


export const DEFAULT_TOOLBOX = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Core",
            "colour": "#48c2c4",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_if"
                },
                {
                    "kind": "block",
                    "type": "logic_compare"
                },
            ]
        },
        {
            "kind": "sep",
            "cssConfig": {
                "container": "yourClassName"
            }
        },
        {
            "kind": "category",
            "name": "Custom",
            "colour": "#48FFc4",
            "contents": [
                // {
                //     "kind": "block",
                //     "type": "start"
                // },
                // {
                //     "kind": "category",
                //     "name": "Move",
                //     "contents": [
                //         {
                //             "kind": "block",
                //             "type": "move_forward"
                //         }
                //     ]
                // },
                // {
                //     "kind": "category",
                //     "name": "Turn",
                //     "contents": [
                //         {
                //             "kind": "block",
                //             "type": "turn_left"
                //         }
                //     ]
                // }
            ]
        }
    ]
}
