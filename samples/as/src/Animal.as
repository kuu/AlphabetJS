package {
  public class Animal {

    protected var gender:String;

    protected var age:int;

    public function Animal() {
      gender = "Male";
      age = 0;
    }

    public function die() : void {
      trace("The animal is dying!");
    }
  }
}
