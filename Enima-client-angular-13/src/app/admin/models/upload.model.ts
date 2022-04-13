 
 
export class Upload {
 
  file: File;
  url: string;
  progress: number;
 
  name: string;
  src :string;
  isLoading:boolean;
  isLoaded:boolean;
  constructor(file: File) {
    this.file = file;
    this.isLoading=false;
    this.isLoaded=false;
    this.url= "";
    this.progress= 0;
    this.name= "";
    this.src="";
  }
}
  