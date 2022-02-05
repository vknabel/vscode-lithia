// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  restartLSP();

  vscode.workspace.onDidChangeConfiguration((configEvent) => {
    const requiresRestart = configEvent.affectsConfiguration("lithia.path");
    if (requiresRestart) {
      restartLSP();
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (client) {
    client.stop();
  }
}

function restartLSP() {
  if (client) {
    client.stop();
  }
  const serverOptions: ServerOptions = {
    command: vscode.workspace
      .getConfiguration()
      .get("lithia.path", "/usr/local/bin/lithia"),
    args: ["lsp", "stdio"],
    transport: TransportKind.stdio,
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "lithia" },
      { scheme: "file", pattern: "*.lithia" },
      { scheme: "file", language: "swift" },
      { scheme: "file", pattern: "*.swift" },
    ],
    outputChannelName: "Lithia",
  };
  client = new LanguageClient(
    "lithia",
    "Lithia Language Server",
    serverOptions,
    clientOptions,
    false
  );
  client.start();
}
