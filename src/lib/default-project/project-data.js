/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = () => {
    return ({
        "targets": [
              {
                "isStage": true,
                "name": "Stage",
                "variables": {},
                "lists": {
                  "#,mC:=!x#r75xbC{yqu-": [
                    "访客信息",
                    []
                  ]
                },
                "broadcasts": {},
                "blocks": {
                  "l|w$xi5I6r;DpFC;a]M9": {
                    "opcode": "procedures_definition",
                    "next": "S?_AKGj/9z(9Ir6/ca09",
                    "parent": null,
                    "inputs": {
                      "custom_block": [
                        1,
                        "ZH!!on(ybsnn{,hlb}4$"
                      ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 0,
                    "y": 0
                  },
                  "ZH!!on(ybsnn{,hlb}4$": {
                    "opcode": "procedures_prototype",
                    "next": null,
                    "parent": "l|w$xi5I6r;DpFC;a]M9",
                    "inputs": {},
                    "fields": {},
                    "shadow": true,
                    "topLevel": false,
                    "mutation": {
                      "tagName": "mutation",
                      "children": [],
                      "proccode": "获取访客信息",
                      "argumentids": "[]",
                      "argumentnames": "[]",
                      "argumentdefaults": "[]",
                      "warp": "false"
                    }
                  },
                  "S?_AKGj/9z(9Ir6/ca09": {
                    "opcode": "data_addtolist",
                    "next": null,
                    "parent": "l|w$xi5I6r;DpFC;a]M9",
                    "inputs": {
                      "ITEM": [
                        3,
                        "64,L:s,Ab5xcpM~^E!Gk",
                        [
                          10,
                          ""
                        ]
                      ]
                    },
                    "fields": {
                      "LIST": [
                        "访客信息",
                        "#,mC:=!x#r75xbC{yqu-"
                      ]
                    },
                    "shadow": false,
                    "topLevel": false
                  },
                  "64,L:s,Ab5xcpM~^E!Gk": {
                    "opcode": "sensing_operatingsystem",
                    "next": null,
                    "parent": "S?_AKGj/9z(9Ir6/ca09",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  },
                  ";VfCqVKd|9e_Q%$u#LSt": {
                    "opcode": "event_whenflagclicked",
                    "next": "(-?}GSJ/b0jzsJFOd`x2",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 0,
                    "y": 168
                  },
                  "(-?}GSJ/b0jzsJFOd`x2": {
                    "opcode": "procedures_call",
                    "next": null,
                    "parent": ";VfCqVKd|9e_Q%$u#LSt",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false,
                    "mutation": {
                      "tagName": "mutation",
                      "children": [],
                      "proccode": "获取访客信息",
                      "argumentids": "[]",
                      "warp": "false"
                    }
                  }
                },
                "comments": {},
                "currentCostume": 0,
                "costumes": [
                  {
                    "assetId": "cd21514d0531fdffb22204e0ec5ed84a",
                    "name": "背景1",
                    "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 240,
                    "rotationCenterY": 180
                  }
                ],
                "sounds": [],
                "volume": 100,
                "layerOrder": 0,
                "tempo": 60,
                "videoTransparency": 50,
                "videoState": "on",
                "textToSpeechLanguage": null
              },
              {
                "isStage": false,
                "name": "Sparrow",
                "variables": {},
                "lists": {},
                "broadcasts": {},
                "blocks": {
                  "QRq%AD1]9l~+3bTKU|$P": {
                    "opcode": "event_whenflagclicked",
                    "next": "zJ/`*%Y,O#hi9]Lvjd(n",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": -136,
                    "y": -194,
                    "comment": "*Q0Qq!/pE61At;h8g46Q"
                  },
                  "zJ/`*%Y,O#hi9]Lvjd(n": {
                    "opcode": "sensing_askandwait",
                    "next": "rK*$cCEC!p~!7s`F6?i4",
                    "parent": "QRq%AD1]9l~+3bTKU|$P",
                    "inputs": {
                      "QUESTION": [
                        1,
                        [
                          10,
                          "你叫什么名字？"
                        ]
                      ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  },
                  "rK*$cCEC!p~!7s`F6?i4": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "zJ/`*%Y,O#hi9]Lvjd(n",
                    "inputs": {
                      "MESSAGE": [
                        3,
                        "SpCWadm`@%$LI(6h3wEY",
                        [
                          10,
                          "你好！"
                        ]
                      ],
                      "SECS": [
                        1,
                        [
                          4,
                          "2"
                        ]
                      ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  },
                  "SpCWadm`@%$LI(6h3wEY": {
                    "opcode": "operator_join",
                    "next": null,
                    "parent": "rK*$cCEC!p~!7s`F6?i4",
                    "inputs": {
                      "STRING1": [
                        3,
                        "?,Z81(5zHBDOWC2[Z}I7",
                        [
                          10,
                          "苹果 "
                        ]
                      ],
                      "STRING2": [
                        1,
                        [
                          10,
                          "！"
                        ]
                      ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  },
                  "?,Z81(5zHBDOWC2[Z}I7": {
                    "opcode": "operator_join",
                    "next": null,
                    "parent": "SpCWadm`@%$LI(6h3wEY",
                    "inputs": {
                      "STRING1": [
                        1,
                        [
                          10,
                          "你好，"
                        ]
                      ],
                      "STRING2": [
                        3,
                        "+3f$iBHxxX(Un32ZezHg",
                        [
                          10,
                          "香蕉"
                        ]
                      ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  },
                  "+3f$iBHxxX(Un32ZezHg": {
                    "opcode": "sensing_answer",
                    "next": null,
                    "parent": "?,Z81(5zHBDOWC2[Z}I7",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                  }
                },
                "comments": {
                  "*Q0Qq!/pE61At;h8g46Q": {
                    "blockId": "QRq%AD1]9l~+3bTKU|$P",
                    "x": 102.14814814814832,
                    "y": -190.66666666666686,
                    "width": 200,
                    "height": 200,
                    "minimized": true,
                    "text": "示例脚本，可删除"
                  }
                },
                "currentCostume": 0,
                "costumes": [
                  {
                    "assetId": "75dabc032cdde1103729691730f1e4ca",
                    "name": "standing",
                    "bitmapResolution": 1,
                    "md5ext": "75dabc032cdde1103729691730f1e4ca.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 51.361259424846025,
                    "rotationCenterY": 63.10707130675968
                  }
                ],
                "sounds": [
                  {
                    "assetId": "18e5a88512296cd96417449496bd8711",
                    "name": "Tropical Birds",
                    "dataFormat": "wav",
                    "rate": 22050,
                    "sampleCount": 546609,
                    "md5ext": "18e5a88512296cd96417449496bd8711.wav"
                  }
                ],
                "volume": 100,
                "layerOrder": 1,
                "visible": true,
                "x": 0,
                "y": 0,
                "size": 100,
                "direction": 90,
                "draggable": false,
                "rotationStyle": "all around"
              }
            ],
            "monitors": [
              {
                "id": "sensing_username",
                "mode": "default",
                "opcode": "sensing_username",
                "params": {},
                "spriteName": null,
                "value": "",
                "width": 0,
                "height": 0,
                "x": 5,
                "y": 5,
                "visible": false,
                "sliderMin": 0,
                "sliderMax": 100,
                "isDiscrete": true
              },
              {
                "id": "#,mC:=!x#r75xbC{yqu-",
                "mode": "list",
                "opcode": "data_listcontents",
                "params": {
                  "LIST": "访客信息"
                },
                "spriteName": null,
                "value": [],
                "width": 0,
                "height": 0,
                "x": 5,
                "y": 5,
                "visible": false
              }
            ],
            "extensions": [],
            "meta": {
              "semver": "3.0.0",
              "vm": "3.0.9",
              "agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0"
            }
    });
};


export default projectData;