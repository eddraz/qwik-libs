import { isBrowser } from "@builder.io/qwik";

export class StorageService {
  type: "local" | "session" = "local";

  private getStorage(type: "local" | "session"): Storage | null {
    let storage: Storage | null = null;

    if (isBrowser) {
      storage =
        type === "local"
          ? localStorage
          : type === "session"
            ? sessionStorage
            : localStorage;
    }

    return storage;
  }

  get(id: string): string {
    let response: string = "";

    if (isBrowser) {
      response = this.getStorage(this.type)?.getItem(id) || "null";
    }

    return response;
  }

  set(id: string, value: string): boolean {
    let response: boolean = false;

    if (isBrowser) {
      this.getStorage(this.type)?.setItem(id, value);

      response = true;
    }

    return response;
  }

  remove(id: string): boolean {
    let response: boolean = false;

    if (isBrowser) {
      this.getStorage(this.type)?.removeItem(id);

      response = true;
    }

    return response;
  }
}
