import {BrowserMultiFormatReader, NotFoundException} from "@zxing/library";
import {createVNode, render} from "vue";
import CButton from "@/components/CButton.vue";

// 扫码组件
const BarcodeScannerComponent = defineComponent({
  name: "BarcodeScanner",
  emits: ["scan"],
  setup(_, {emit}) {
    const codeReader = ref(new BrowserMultiFormatReader());
    const openScanner = ref(false);

    watch(openScanner, (val) => {
      if (val) {
        nextTick().then(() => {
          codeReader.value.decodeOnceFromVideoDevice(undefined, "video")
            .then(result => {
              openScanner.value = false;
              codeReader.value.reset();
              emit("scan", result);
            })
            .catch(err => {
              if (!(err instanceof NotFoundException)) {
                console.error("Scanner error:", err);
              }
            });
        });
      }
    }, {immediate: true});

    const handleCancelScanner = () => {
      codeReader.value.reset();
      openScanner.value = false;
    };

    const open = () => {
      openScanner.value = true;
    };

    return {
      openScanner,
      handleCancelScanner,
      open
    };
  },
  expose: ["open"],
  render() {
    return h(
      "div",
      {
        class: "scanner-container",
        style: {
          display: this.openScanner ? "block" : "none",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "10",
          backgroundColor: "#00000099"
        }
      },
      [
        h("video", {
          id: "video",
          width: window.innerWidth,
          height: window.innerHeight,
        }),
        h(
          "div",
          {
            class: "button-bar",
            style: {
              position: "relative",
              bottom: "80px",
              justifyContent: "center",
            }
          },
          [
            h(
              CButton,
              {
                type: "warning",
                onClick: this.handleCancelScanner,
                style: {
                  fontSize: "18px",
                  height: "50px",
                }
              },
              () => "取消识别"
            )
          ]
        )
      ]
    );
  }
});

// 单例控制器
let instance: VNode;
let container: HTMLElement;

interface Options {
  scan: (result: any) => void;
}

export default function BarcodeScanner(options: Options) {
  if (!container) {
    container = document.createElement("div");
    document.body.appendChild(container);
  }
  instance = createVNode(BarcodeScannerComponent, {
    onScan: options.scan
  });
  render(instance, container);
  instance.component?.exposed?.open();
}