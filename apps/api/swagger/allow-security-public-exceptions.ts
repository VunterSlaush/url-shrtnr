import { OpenAPIObject } from "@nestjs/swagger";

interface OperationObject {
  security?: Record<string, string[]>[] | string[];
}

interface Path {
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
}

interface Document {
  paths: Record<string, Path>;
}

export function allowSecurityPublicExceptions(document: OpenAPIObject) {
  Object.values(document.paths).forEach((path: Path) => {
    Object.values(path).forEach((method: OperationObject) => {
      if (Array.isArray(method.security)) {
        const arr = method.security as string[];

        if (arr.includes('public')) {
          method.security = [];
        }
      }
    });
  });
}
